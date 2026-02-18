import { execSync } from "child_process";
import path from "path";

function run(command: string) {
    console.log(`\n> Running: ${command}`);
    execSync(command, { stdio: "inherit" });
}

const projects = [
    {
        yaml: "main.yaml",
        tsOutput: "src/types.ts",
        zodOutput: "src/zod.ts",
    },
];

for (const project of projects) {
    const yamlPath = path.resolve(project.yaml);

    run(`npx openapi-typescript "${yamlPath}" --output "${project.tsOutput}"`);
    run(`npx openapi-zod-client "${yamlPath}" -o "${project.zodOutput}"`);
}

console.log("\nOpenAPI types and Zod schemas generated successfully!");