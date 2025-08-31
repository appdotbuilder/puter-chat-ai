import { type AiModel } from '../schema';

export async function getAiModels(): Promise<AiModel[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all available AI models from the database.
    // This will be used to populate the model selection dropdown in the chat interface.
    // Should only return active models for the frontend.
    return Promise.resolve([
        {
            id: 'gpt-4',
            name: 'GPT-4',
            provider: 'openai',
            description: 'OpenAI GPT-4 model',
            is_active: true,
            created_at: new Date()
        },
        {
            id: 'claude-3',
            name: 'Claude 3',
            provider: 'claude',
            description: 'Anthropic Claude 3 model',
            is_active: true,
            created_at: new Date()
        }
    ] as AiModel[]);
}