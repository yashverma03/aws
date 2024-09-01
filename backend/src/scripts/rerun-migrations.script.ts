import { execSync } from 'child_process';
import { ConsoleColorEnum } from 'src/enums/console-color.enum';

const revertCount = process.argv[2] ? parseInt(process.argv[2], 10) : 1;

try {
  execSync(`npm run migration:revert ${revertCount}`, { stdio: 'inherit' });
  console.log(
    `${ConsoleColorEnum.Orange}Reverting migrations completed. Running migrations...${ConsoleColorEnum.Reset}`
  );
  execSync('npm run migration:run', { stdio: 'inherit' });
} catch (error) {
  console.error(`${ConsoleColorEnum.Red}An error occurred: ${error}${ConsoleColorEnum.Reset}`);
  process.exit(1);
}
