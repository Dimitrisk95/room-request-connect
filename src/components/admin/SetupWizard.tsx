
import SimpleSetupWizard from "./setup-wizard/SimpleSetupWizard";

export { type SetupData } from "./setup-wizard/types";

interface SetupWizardProps {
  debugMode?: boolean;
}

const SetupWizard = ({ debugMode = false }: SetupWizardProps) => {
  return <SimpleSetupWizard debugMode={debugMode} />;
};

export default SetupWizard;
