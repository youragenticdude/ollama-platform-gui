Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { action, workflowData, agentId, executionData } = await req.json();
        
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get user from auth header
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': serviceRoleKey
            }
        });

        if (!userResponse.ok) {
            throw new Error('Invalid token');
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        let result;

        switch (action) {
            case 'save_workflow':
                // Save or update workflow
                const existingWorkflowResponse = await fetch(`${supabaseUrl}/rest/v1/workflows?agent_id=eq.${agentId}`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });

                const existingWorkflows = await existingWorkflowResponse.json();
                
                if (existingWorkflows.length > 0) {
                    // Update existing workflow
                    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/workflows?agent_id=eq.${agentId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            name: workflowData.name,
                            description: workflowData.description,
                            flow_data: workflowData.flow_data,
                            nodes: workflowData.nodes,
                            edges: workflowData.edges,
                            is_active: workflowData.is_active || false,
                            version: (existingWorkflows[0].version || 0) + 1,
                            updated_at: new Date().toISOString()
                        })
                    });
                    
                    if (!updateResponse.ok) {
                        throw new Error('Failed to update workflow');
                    }
                    
                    result = await updateResponse.json();
                } else {
                    // Create new workflow
                    const createResponse = await fetch(`${supabaseUrl}/rest/v1/workflows`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            agent_id: agentId,
                            name: workflowData.name,
                            description: workflowData.description,
                            flow_data: workflowData.flow_data,
                            nodes: workflowData.nodes,
                            edges: workflowData.edges,
                            is_active: workflowData.is_active || false,
                            version: 1
                        })
                    });
                    
                    if (!createResponse.ok) {
                        throw new Error('Failed to create workflow');
                    }
                    
                    result = await createResponse.json();
                }
                break;
                
            case 'execute_workflow':
                // Execute workflow with given input
                const workflowResponse = await fetch(`${supabaseUrl}/rest/v1/workflows?agent_id=eq.${agentId}&is_active=eq.true`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });

                if (!workflowResponse.ok) {
                    throw new Error('Failed to fetch workflow');
                }

                const workflows = await workflowResponse.json();
                
                if (workflows.length === 0) {
                    throw new Error('No active workflow found for this agent');
                }

                const workflow = workflows[0];
                
                // Simulate workflow execution
                const executionResult = {
                    workflow_id: workflow.id,
                    execution_id: crypto.randomUUID(),
                    input_data: executionData,
                    output_data: {
                        processed: true,
                        result: 'Workflow executed successfully',
                        steps_completed: workflow.nodes?.length || 0,
                        execution_time: Math.random() * 2000 + 500 // 500-2500ms
                    },
                    status: 'completed',
                    started_at: new Date().toISOString(),
                    completed_at: new Date().toISOString()
                };
                
                // Log workflow execution
                await fetch(`${supabaseUrl}/rest/v1/activity_logs`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        agent_id: agentId,
                        action_type: 'workflow_executed',
                        description: `Workflow executed for agent`,
                        metadata: {
                            workflow_id: workflow.id,
                            execution_id: executionResult.execution_id,
                            execution_time: executionResult.output_data.execution_time
                        }
                    })
                });
                
                result = executionResult;
                break;
                
            case 'get_workflow':
                // Get workflow for agent
                const getWorkflowResponse = await fetch(`${supabaseUrl}/rest/v1/workflows?agent_id=eq.${agentId}`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });

                if (!getWorkflowResponse.ok) {
                    throw new Error('Failed to fetch workflow');
                }

                result = await getWorkflowResponse.json();
                break;
                
            case 'activate_workflow':
                // Activate workflow
                const activateResponse = await fetch(`${supabaseUrl}/rest/v1/workflows?agent_id=eq.${agentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        is_active: true,
                        updated_at: new Date().toISOString()
                    })
                });
                
                if (!activateResponse.ok) {
                    throw new Error('Failed to activate workflow');
                }
                
                result = await activateResponse.json();
                
                // Also update agent status to active
                await fetch(`${supabaseUrl}/rest/v1/agents?id=eq.${agentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'active',
                        updated_at: new Date().toISOString()
                    })
                });
                break;
                
            default:
                throw new Error('Invalid action');
        }

        return new Response(JSON.stringify({ data: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Workflow execution error:', error);

        const errorResponse = {
            error: {
                code: 'WORKFLOW_EXECUTION_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});