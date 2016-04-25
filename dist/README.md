# Distribution Package

### Information
The distribution package contains all of the files and folders that should be staticly served by the web server.
This folder will be populated with HTML, Javascript, CSS, Fonts, Images and Language Files

**Do not alter the files or file/folder structure of the distributed package. It should be served as is by the web server**

### Stamping for caching / cache busting
The index.html file gets automatically injected with the distribution timestamp to ensure proper caching / cache busting.

    <link href="/client.min.css?<distribution-stamp>" rel="stylesheet" type="text/css" />
    <script src="/client.min.js?<distribution-stamp>"></script>

To build the distribution package run the following command in the root directory of the project:

    npm run build:dist
