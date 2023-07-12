const DEV_MODE = process.env.HTK_DEV === 'true';

import * as Sentry from '@sentry/electron';
import { RewriteFrames } from '@sentry/integrations';

if (!DEV_MODE) {
    Sentry.init({
        dsn: 'https://1194b128453942ed9470d49a74c35992@o202389.ingest.sentry.io/1367048',
        integrations: [
            new RewriteFrames({
                // Make all paths relative to this root, because otherwise it can make
                // errors unnecessarily distinct, especially on Windows.
                root: process.platform === 'win32'
                    // Root must always be POSIX format, so we transform it on Windows:
                    ? __dirname
                        .replace(/^[A-Z]:/, '') // remove Windows-style prefix
                        .replace(/\\/g, '/') // replace all `\\` instances with `/`
                    :  __dirname
            })
        ]
    });
}

export function logError(error: Error | string, fingerprint?: string[]) {
    console.log(error);

    const context = fingerprint
        ? {
            fingerprint:[
                "{{ default }}",
                ...fingerprint.filter(x => !!x)
            ]
        }
        : undefined;

    if (typeof error === 'string') {
        Sentry.captureMessage(error, context);
    } else {
        Sentry.captureException(error, context);
    }
}

export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
}