'use strict';

// parameters
const {Bucket, AccessKey, SecretKey, Region} = process.env;

const AWS = require('aws-sdk');
const Sharp = require('sharp');

AWS.config.region = Region;
AWS.config.credentials = new AWS.Credentials(AccessKey, SecretKey);
const S3 = new AWS.S3({signatureVersion: 'v4'});

const PathPattern = /(.*\/)?(.*)\/(.*)/;

exports.handler = async (event) => {
    const path = event.queryStringParameters.path;
    const parts = PathPattern.exec(path);
    const dir = parts[1] || '';
    const options = parts[2].split('_');
    const filename = parts[3];

    const sizes = options[0].split("x");
    const action = options.length > 1 ? options[1] : null;

    if (action && action !== 'max' && action !== 'min') {
        return {
            statusCode: 400,
            body: `Unknown func parameter "${action}"\n` +
                'For query ".../150x150_func", "_func" must be either empty, "_min" or "_max"',
            headers: {"Content-Type": "text/plain"}
        };
    }

    try {
        const existingFileMetadataRequest = await S3.headObject({
            Bucket: Bucket,
            Key: path
        }).promise();

        // File exists
        if (!(existingFileMetadataRequest.$response.error && existingFileMetadataRequest.$response.error.code === 'NotFound')) {
            const signedUrl = S3.getSignedUrl('getObject', {
                Bucket: Bucket,
                Key: path,
                Expires: 86400 // One day
            });

            return {
                statusCode: 301,
                headers: {"Location" : signedUrl}
            };
        }
    } catch (e) {

    }

    try {
        const data = await S3
            .getObject({Bucket: Bucket, Key: dir + filename})
            .promise();

        const width = sizes[0] === 'AUTO' ? null : parseInt(sizes[0]);
        const height = sizes[1] === 'AUTO' ? null : parseInt(sizes[1]);
        let fit;
        switch (action) {
            case 'max':
                fit = 'inside';
                break;
            case 'min':
                fit = 'outside';
                break;
            default:
                fit = 'cover';
                break;
        }
        const result = await Sharp(data.Body, {failOnError: false})
            .resize(width, height, {withoutEnlargement: true, fit})
            .rotate()
            .toBuffer();

        await S3.putObject({
            Body: result,
            Bucket: Bucket,
            ContentType: data.ContentType,
            Key: path,
            CacheControl: 'public, max-age=86400'
        }).promise();

        const signedUrl = S3.getSignedUrl('getObject', {
            Bucket: Bucket,
            Key: path,
            Expires: 86400 // One day
        });

        return {
            statusCode: 301,
            headers: {"Location" : signedUrl}
        };
    } catch (e) {
        return {
            statusCode: e.statusCode || 400,
            body: 'Exception: ' + e.message,
            headers: {"Content-Type": "text/plain"}
        };
    }
};