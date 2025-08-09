import net from 'net';
import { NextResponse } from 'next/server';

export async function GET() {
    const host = 'db.cydnqhdivufuuduhnfwq.supabase.co';
    const port = 5432;

    return new Promise<Response>((resolve) => {
        const socket = new net.Socket();
        const timeout = 5000; // 5 seconds timeout

        const onError = (err: Error) => {
            socket.destroy();
            resolve(
                NextResponse.json({ success: false, error: err.message }, { status: 500 })
            );
        };

        socket.setTimeout(timeout);
        socket.on('timeout', () => onError(new Error('Connection timed out')));
        socket.on('error', onError);

        socket.connect(port, host, () => {
            socket.end();
            resolve(
                NextResponse.json(
                    { success: true, message: `Connected to ${host}:${port}` },
                    { status: 200 }
                )
            );
        });
    });
}
