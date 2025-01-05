'use client'

import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React from 'react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

type Props = {
	children: React.ReactNode;
}

export const ConvexClientProvider = ({ children }: Props) => {
	return (
		<ClerkProvider>
			<ConvexProviderWithClerk useAuth={useAuth} client={convex}>
				{ children }
			</ConvexProviderWithClerk>
		</ClerkProvider>
	)
}