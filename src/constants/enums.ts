export const enum AppEnums {
  DEAL_DRAFT = 'dealDraft',
  SUBADMIN_SESSION = 'subadmindetails',
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  AWS_FILE = 'awsFile',
}

export const AWS_BUCKET_NAME =
  import.meta.env.VITE_AWS_BUCKET_NAME || 'fundos-dev-bucket';
export const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'ap-south-1';
