export async function GET(req) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.socket.remoteAddress || null;
    
    return new Response(JSON.stringify({ ip: ip }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}