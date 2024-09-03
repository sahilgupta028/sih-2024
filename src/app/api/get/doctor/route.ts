import DoctorModel from "@/models/Doctor";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect();
    console.log("Connected to DB");

    try {
        // Fetch all doctors from the database
        const doctors = await DoctorModel.find({});

        if (doctors.length === 0) {
            console.log("No doctor found");

            return NextResponse.json(
                {
                    error: "No doctors found"
                },
                {
                    status: 404,
                    statusText: "Doctors Not Found"
                }
            );
        }

        console.log("Doctors found successfully :) ", doctors);

        return NextResponse.json(
            {
                data: doctors,
                message: "Doctors found successfully"
            },
            {
                status: 200,
                statusText: "Doctors Found"
            }
        );

    } catch (error) {
        console.log("Error fetching doctors: ", error);

        return NextResponse.json(
            {
                error: "Error fetching doctors :( " + error
            },
            {
                status: 500,
                statusText: "Internal Server Error"
            }
        );
    }
}
