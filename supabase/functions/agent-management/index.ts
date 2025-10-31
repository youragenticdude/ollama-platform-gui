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
        const { action, agentData, agentId } = await req.json();
        
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
            case 'create':
                // Create new agent
                const createResponse = await fetch(`${supabaseUrl}/rest/v1/agents`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        ...agentData,
                        user_id: userId,
                        status: 'inactive',
                        created_at: new Date().toISOString()
                    })
                });
                
                if (!createResponse.ok) {
                    throw new Error('Failed to create agent');
                }
                
                result = await createResponse.json();
                
                // Log activity
                await fetch(`${supabaseUrl}/rest/v1/activity_logs`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        agent_id: result[0].id,
                        action_type: 'agent_created',
                        description: `Created agent: ${agentData.name}`,
                        metadata: { agent_name: agentData.name }
                    })
                });
                break;
                
            case 'update':
                // Update existing agent
                const updateResponse = await fetch(`${supabaseUrl}/rest/v1/agents?id=eq.${agentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        ...agentData,
                        updated_at: new Date().toISOString()
                    })
                });
                
                if (!updateResponse.ok) {
                    throw new Error('Failed to update agent');
                }
                
                result = await updateResponse.json();
                break;
                
            case 'start':
                // Start agent
                const startResponse = await fetch(`${supabaseUrl}/rest/v1/agents?id=eq.${agentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        status: 'active',
                        updated_at: new Date().toISOString()
                    })
                });
                
                if (!startResponse.ok) {
                    throw new Error('Failed to start agent');
                }
                
                result = await startResponse.json();
                
                // Create alert for agent started
                await fetch(`${supabaseUrl}/rest/v1/alerts`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        agent_id: agentId,
                        alert_type: 'status_change',
                        severity: 'info',
                        title: 'Agent Started',
                        message: 'Agent has been successfully started and is now active.'
                    })
                });
                break;
                
            case 'stop':
                // Stop agent
                const stopResponse = await fetch(`${supabaseUrl}/rest/v1/agents?id=eq.${agentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        status: 'inactive',
                        updated_at: new Date().toISOString()
                    })
                });
                
                if (!stopResponse.ok) {
                    throw new Error('Failed to stop agent');
                }
                
                result = await stopResponse.json();
                break;
                
            case 'delete':
                // Delete agent
                const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/agents?id=eq.${agentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });
                
                if (!deleteResponse.ok) {
                    throw new Error('Failed to delete agent');
                }
                
                result = { success: true, message: 'Agent deleted successfully' };
                break;
                
            default:
                throw new Error('Invalid action');
        }

        return new Response(JSON.stringify({ data: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Agent management error:', error);

        const errorResponse = {
            error: {
                code: 'AGENT_MANAGEMENT_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});