export const getS3Link = (fileName: null | string = null) => {
  const s3Link = {
    demo: `https://vendorpm-public-demo.s3.ca-central-1.amazonaws.com`,
    development: `https://vendorpm-public-dev.s3.ca-central-1.amazonaws.com`,
    local: `https://vendorpm-public-dev.s3.ca-central-1.amazonaws.com`,
    production: `https://vendorpm-public.s3.ca-central-1.amazonaws.com`,
    staging: `https://vendorpm-public-stg.s3.ca-central-1.amazonaws.com`,
  };

  //TODO: Get this from env variable
  const s3Uri = s3Link['development'];

  return fileName ? `${s3Uri}/${encodeURIComponent(fileName)}` : '';
};
