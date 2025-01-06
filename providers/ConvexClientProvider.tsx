'use client'

import Loading from '@/app/loading';
import { ClerkProvider, SignIn, useAuth } from '@clerk/nextjs'
import { Authenticated, AuthLoading, ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React from 'react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

type Props = {
	children: React.ReactNode;
}

export const ConvexClientProvider = ({ children }: Props) => {
	return (
		<ClerkProvider dynamic>
			<ConvexProviderWithClerk useAuth={useAuth} client={convex}>
				<Authenticated>
					{children}
				</Authenticated>
				<AuthLoading>
					<Loading />
				</AuthLoading>
				<SignIn routing='hash'/>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	)
}