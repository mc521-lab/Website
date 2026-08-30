# MC521 Website

# Velite Data Auto-Gen Scripts

## Preparation

1. Install Python, in this case, version 3.12.
2. Install uv, a better package manager than Python's default pip.
3. Install the required packages by running `uv sync`.
4. Compile CLI, by running `uv build`.

## Usage

4. Call the CLI from the project root directory (DO NOT run it from the `scripts` directory.),
   by running `uv run --project scripts/gallery_generator gallery-generator`
5. Follow the CLI's instructions to generate the data.

## Tip:

- You should have the source data ready before usage, in the `raw-config` directory.
- If you do not use uv, you may need to adopt the commands to your environment.
- This generator will generate new data in incremental update mode,
  so don't worry it will overwrite the existing (modified) data.
