const { withEntitlementsPlist } = require("expo/config-plugins");

/**
 * Free Apple ID ("Personal Team") builds can't sign the Push Notifications
 * capability, which expo-notifications always adds. Crystal only schedules
 * local reminders, which don't need it.
 *
 * Set CRYSTAL_FREE_SIGNING=1 when running `npx expo run:ios --device` with a
 * free Apple ID to drop the push entitlement. Paid / EAS builds leave it on.
 */
module.exports = function withoutPushEntitlement(config) {
  if (process.env.CRYSTAL_FREE_SIGNING !== "1") return config;
  return withEntitlementsPlist(config, (cfg) => {
    delete cfg.modResults["aps-environment"];
    return cfg;
  });
};
