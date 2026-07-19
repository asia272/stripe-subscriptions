
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { isUserSubscribed } from '../actions/premium.action';
import { redirect } from 'next/navigation';

const page = async () => {
    const result = await isUserSubscribed();

    if (!result.success || !result.subscribed) {
        redirect("/");
    }

    return (
        <div> This page is only visible for premium users</div>
    )
}

export default page
