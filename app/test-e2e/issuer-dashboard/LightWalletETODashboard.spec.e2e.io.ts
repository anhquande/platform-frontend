import { backupLightWalletSeed } from "../shared/backupLightWalletSeed";
import {
  assertBackupSeedWidgetVisible,
  assertEmailActivationWidgetVisible,
  assertEtoDashboard,
  registerWithLightWalletETO,
  verifyLatestUserEmail,
} from "../utils";
import { goToEtoDashboard } from "../utils/navigation";
import { DEFAULT_PASSWORD, generateRandomEmailAddress } from "../utils/userHelpers";

describe.skip("Light Wallet ETO Dashboard", () => {
  // We don't need this test
  it("should register verify an email and assert that the dashboard is changing", () => {
    const email = generateRandomEmailAddress();
    registerWithLightWalletETO(email, DEFAULT_PASSWORD, true);

    assertEtoDashboard();
    assertBackupSeedWidgetVisible();
    assertEmailActivationWidgetVisible();

    backupLightWalletSeed();
    goToEtoDashboard();

    assertBackupSeedWidgetVisible(true);
    assertEmailActivationWidgetVisible();

    verifyLatestUserEmail(email);
    goToEtoDashboard();

    assertEmailActivationWidgetVisible(true);
    assertBackupSeedWidgetVisible(true);
  });
});
