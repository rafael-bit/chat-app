'use client';

import { useState } from 'react';

export default function TestDevotional() {
	const [devotional, setDevotional] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchDevotional = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetch('/api/devotional');
			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			setDevotional(data.devotional);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao carregar devocional');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4">
			<button
				onClick={fetchDevotional}
				disabled={loading}
				className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
			>
				{loading ? 'Carregando...' : 'Gerar Devocional'}
			</button>

			{error && (
				<div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
					{error}
				</div>
			)}

			{devotional && (
				<div className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
					{devotional}
				</div>
			)}
		</div>
	);
} 