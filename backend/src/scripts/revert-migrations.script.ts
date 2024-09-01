import { execSync } from 'child_process';
import { ConsoleColorEnum } from 'src/enums/console-color.enum';

const revertCount = process.argv[2] ? parseInt(process.argv[2], 10) : 1;

if (isNaN(revertCount) || revertCount < 1) {
  console.error(
    `${ConsoleColorEnum.Red}Please provide a valid number of migrations to revert.${ConsoleColorEnum.Reset}`
  );
  process.exit(1);
}

for (let i = 0; i < revertCount; i++) {
  try {
    console.log(
      `${ConsoleColorEnum.Orange}Reverting migration ${i + 1} of ${revertCount}...${ConsoleColorEnum.Reset}`
    );
    execSync('npm run typeorm migration:revert -- -d src/config/data-source.config.ts', {
      stdio: 'inherit'
    });
  } catch (error) {
    console.error(
      `${ConsoleColorEnum.Red}Failed to revert migration ${i + 1}.${ConsoleColorEnum.Reset}`,
      error
    );
    process.exit(1);
  }
}

console.log(
  `${ConsoleColorEnum.Orange}Successfully reverted ${revertCount} migrations.${ConsoleColorEnum.Reset}`
);
