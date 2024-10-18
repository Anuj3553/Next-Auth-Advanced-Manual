import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function POST(request: NextRequest) {
    try {
        // extract data from token
        const userId = await getDataFromToken(request)
        const user = await User.findOne({_id: userId}).select("-password") // for removing the object use '-' symbol

        // Check if there is no user
        return NextResponse.json({
            message: "User found",
            data: user
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}