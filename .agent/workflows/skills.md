---
description: how to use installed skills
---

When the user asks you to perform a task that relates to an available skill (listed in AGENTS.md), you should:

1. Use `npx openskills read <skill-name>` to load the skill instructions.
2. Follow the instructions provided in the output.
3. Use the base directory provided in the output to resolve any relative paths to scripts or assets.

// turbo
To see what skills are currently available, you can run:
```bash
npx openskills list
```
