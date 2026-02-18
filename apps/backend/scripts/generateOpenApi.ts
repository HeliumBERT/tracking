import { execSync } from "child_process";
import path from "path";

function run(command: string) {
    console.log(`\n> Running: ${command}`);
    execSync(command, { stdio: "inherit" });
}

const projects = [
    {
        yaml: "shared/board-backend/main.yaml",
        tsOutput: "src/shared/board-backend/types.ts",
        zodOutput: "src/shared/board-backend/zod.ts",
    },
    {
        yaml: "shared/board-inference/main.yaml",
        tsOutput: "src/shared/board-inference/types.ts",
        zodOutput: "src/shared/board-inference/zod.ts",
    },
];

for (const project of projects) {
    const yamlPath = path.resolve(project.yaml);

    run(`npx openapi-typescript "${yamlPath}" --output "${project.tsOutput}"`);
    run(`npx openapi-zod-client "${yamlPath}" -o "${project.zodOutput}"`);
}

console.log("\nOpenAPI types and Zod schemas generated successfully!");