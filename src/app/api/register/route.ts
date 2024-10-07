import { NextRequest, NextResponse } from "next/server";

interface registerUser{
    email: string;
    username: string;
    password: string;
    name: string;
    phone: string;
}

export async function POST(req: NextRequest) {
    const {
        email,
        username,
        password,
        name,
        phone,
    }= await req.json();
    const userData: registerUser = {
        email,
        username,
        password,
        name,
        phone
    };

    const res = await fetch(`${process.env.API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const result = await res.json();
    console.log("BACK", result);

    return NextResponse.json({
        user: result
    }, { status: 201 });
}
