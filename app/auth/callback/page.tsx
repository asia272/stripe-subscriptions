"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuthStatus } from "@/app/actions/auth.actions";

export default function AuthPage() {
    const router = useRouter();

    useEffect(() => {
        async function authenticate() {
            const result = await checkAuthStatus();

            if (result.success) {
                router.replace("/");
            } else {
                router.replace("/login");
            }
        }

        authenticate();
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black mx-auto"></div>

                <p className="mt-4 text-gray-600">
                    Signing you in...
                </p>
            </div>
        </div>
    );
}