import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
        return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const res = await fetch(`${process.env.API_URL}/auth/products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization, 
        },
    });

    if (!res.ok) {
        return NextResponse.json({ error: 'Error fetching products' }, { status: res.status });
    }

    const products = await res.json();

    return NextResponse.json({
        products
    }, { status: 200 });
}
