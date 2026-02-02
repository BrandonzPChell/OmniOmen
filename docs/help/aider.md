# Using Aider with OpenClaw

Aider is a powerful AI pair programming tool that works in your terminal. This guide covers how aider's repository mapping works and best practices for managing context windows.

## Repository Mapping

Aider uses a **repository map** to provide the LLM with a concise overview of your entire codebase. This allows the LLM to understand the project structure and locate relevant files without needing the full source code of every file in the context window.

### How it works:
- **Symbol Extraction**: Aider uses `ctags` (via tree-sitter) to extract symbols like classes, functions, and method signatures from your files.
- **Graph Ranking**: It builds a graph of your repository where files are nodes and dependencies are edges. A graph ranking algorithm (similar to PageRank) identifies the most "important" files and symbols.
- **Dynamic Sizing**: Aider automatically selects the most relevant portions of this map to fit within a token budget (defaulting to 1024 tokens, controlled by `--map-tokens`).

## Best Practices for Small Context Windows (e.g., 4096 tokens)

When working with models that have a smaller context window, such as 4096 tokens, managing what goes into the window is crucial.

1. **Limit Map Tokens**: Reduce the repository map size using the `--map-tokens` flag (e.g., `--map-tokens 256` or `512`).
2. **Be Selective with Files**: Use `/add <file>` only for the files you are actively editing. Use `/read <file>` for reference files, but be careful as they still consume tokens.
3. **Frequent Resets**: If the context window becomes cluttered, use `/clear` to reset the chat history or restart the session.
4. **Focused Tasks**: Break down complex features into smaller, atomic tasks that require fewer files to be in context simultaneously.
5. **Drop Unused Files**: Use `/drop <file>` to remove files from the chat context once you're done with them.

## Troubleshooting Common Errors

### "Repo-map can't include [file]"
This error occurs when aider's repository map logic finds files tracked in Git that do not exist on your physical filesystem.
- **Cause**: You likely deleted or moved files without updating the Git index.
- **Solution**: Run `git add -A` to synchronize the Git index with your filesystem, or use `git rm <file>` for specific missing files.

### "litellm.NotFoundError" / "No endpoints found"
This usually happens when using OpenRouter with an incorrect or outdated model identifier.
- **Cause**: The model name (e.g., `deepseek/deepseek-r1:free`) might be wrong or unavailable on OpenRouter.
- **Solution**:
  - Double-check the exact model string on the [OpenRouter models page](https://openrouter.ai/models).
  - Try a slightly different variation (e.g., `deepseek/deepseek-r1` instead of `:free`).
  - Ensure your `OPENROUTER_API_KEY` is correctly set.
