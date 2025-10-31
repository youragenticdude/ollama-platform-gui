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
        const url = new URL(req.url);
        const action = url.searchParams.get('action') || 'generate';
        
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

        if (action === 'generate') {
            // Get active agents for this user
            const agentsResponse = await fetch(`${supabaseUrl}/rest/v1/agents?user_id=eq.${userId}&status=eq.active`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            if (!agentsResponse.ok) {
                throw new Error('Failed to fetch agents');
            }

            const agents = await agentsResponse.json();
            const monitoringData = [];

            // Generate realistic monitoring data for each active agent
            for (const agent of agents) {
                const now = new Date();
                const metrics = [
                    {
                        agent_id: agent.id,
                        metric_type: 'response_time',
                        metric_value: Math.random() * 1000 + 100, // 100-1100ms
                        timestamp: now.toISOString(),
                        metadata: { unit: 'ms' }
                    },
                    {
                        agent_id: agent.id,
                        metric_type: 'accuracy',
                        metric_value: Math.random() * 20 + 80, // 80-100%
                        timestamp: now.toISOString(),
                        metadata: { unit: 'percentage' }
                    },
                    {
                        agent_id: agent.id,
                        metric_type: 'user_engagement',
                        metric_value: Math.random() * 50 + 50, // 50-100
                        timestamp: now.toISOString(),
                        metadata: { unit: 'score' }
                    },
                    {
                        agent_id: agent.id,
                        metric_type: 'error_rate',
                        metric_value: Math.random() * 5, // 0-5%
                        timestamp: now.toISOString(),
                        metadata: { unit: 'percentage' }
                    },
                    {
                        agent_id: agent.id,
                        metric_type: 'cpu_usage',
                        metric_value: Math.random() * 80 + 10, // 10-90%
                        timestamp: now.toISOString(),
                        metadata: { unit: 'percentage' }
                    },
                    {
                        agent_id: agent.id,
                        metric_type: 'memory_usage',
                        metric_value: Math.random() * 70 + 20, // 20-90%
                        timestamp: now.toISOString(),
                        metadata: { unit: 'percentage' }
                    }
                ];
                
                monitoringData.push(...metrics);
                
                // Generate alerts for high error rates or performance issues
                const errorRate = metrics.find(m => m.metric_type === 'error_rate')?.metric_value || 0;
                const responseTime = metrics.find(m => m.metric_type === 'response_time')?.metric_value || 0;
                
                if (errorRate > 3) {
                    await fetch(`${supabaseUrl}/rest/v1/alerts`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            agent_id: agent.id,
                            alert_type: 'performance',
                            severity: 'warning',
                            title: 'High Error Rate Detected',
                            message: `Agent ${agent.name} is experiencing elevated error rates (${errorRate.toFixed(1)}%)`,
                            metadata: { error_rate: errorRate, threshold: 3 }
                        })
                    });
                }
                
                if (responseTime > 800) {
                    await fetch(`${supabaseUrl}/rest/v1/alerts`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            agent_id: agent.id,
                            alert_type: 'performance',
                            severity: 'warning',
                            title: 'Slow Response Time',
                            message: `Agent ${agent.name} response time is slower than expected (${responseTime.toFixed(0)}ms)`,
                            metadata: { response_time: responseTime, threshold: 800 }
                        })
                    });
                }
            }

            // Batch insert monitoring data
            if (monitoringData.length > 0) {
                const insertResponse = await fetch(`${supabaseUrl}/rest/v1/monitoring_data`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(monitoringData)
                });

                if (!insertResponse.ok) {
                    throw new Error('Failed to insert monitoring data');
                }
            }

            return new Response(JSON.stringify({ 
                data: { 
                    message: 'Monitoring data generated successfully',
                    metrics_count: monitoringData.length,
                    agents_monitored: agents.length
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        } else if (action === 'retrieve') {
            // Retrieve latest monitoring data
            const agentId = url.searchParams.get('agent_id');
            const metricType = url.searchParams.get('metric_type');
            const hours = parseInt(url.searchParams.get('hours') || '24');
            
            const sinceTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
            
            let query = `${supabaseUrl}/rest/v1/monitoring_data?timestamp=gte.${sinceTime}&order=timestamp.desc&limit=1000`;
            
            if (agentId) {
                query += `&agent_id=eq.${agentId}`;
            }
            
            if (metricType) {
                query += `&metric_type=eq.${metricType}`;
            }

            const dataResponse = await fetch(query, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            if (!dataResponse.ok) {
                throw new Error('Failed to retrieve monitoring data');
            }

            const data = await dataResponse.json();

            return new Response(JSON.stringify({ data }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

    } catch (error) {
        console.error('Monitoring data error:', error);

        const errorResponse = {
            error: {
                code: 'MONITORING_DATA_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});