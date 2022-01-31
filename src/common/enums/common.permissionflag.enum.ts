/* This is a bitwise flag enum, meaning each flag must be
 * set up as the previous flag's number, multiplied by two.
 * The ALL_PERMISSIONS flag is a sudo level flag that should
 * never be assigned to normal users in production as it will
 * allow access to ALL features of the app.
 */
//TODO change these flags to be relevant to your project
export enum PermissionFlag {
  FREE_PERMISSION = 1,
  APP_PERMISSION_A = 2,
  APP_PERMISSION_B = 4,
  PAID_FEATURE_A = 8,
  PAID_FEATURE_B = 16,
  ADMIN_PERMISSION = 32,
  ALL_PERMISSIONS = 2147483647
}
