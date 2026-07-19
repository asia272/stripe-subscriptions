"use client";
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { isUserSubscribed } from '../actions/premium.action';
import { redirect } from 'next/navigation';

const page = () => {
    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["user-subscription"],
        queryFn: isUserSubscribed,
    });

    const isSubscribed = data?.subscribed;

    if (isSubscribed === false) redirect("/")

    return (
        <div> This page is only visible for premium users</div>
    )
}

export default page
