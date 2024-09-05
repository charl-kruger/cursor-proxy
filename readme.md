Proxy cursor.com IDE requests and enrich them with additional context.

e.g. Add private db schemas, table data, file contents etc. to the conversation so the LLM can use that context.

## Useage
Go to Settings>Models>OpenAI and add the following variables:
- API key in OpenAI format (You should not use your real key here as can be stored as a encrypted secret in the worker)
- the deployment URL of your worker