# FR03E1

FR03E1 alias FREO is the event-only Angular fat client application for the FR (fleetrace) family of projects.

Use the base-href value of `/freo/` when the build is intended to be served from a Delphi application.

Use a folder comparison against FR03A1 to see what is different between the two. Read the readme file for the FR03A1 project.

There are variations of this project, but I decided to publish this one.
It is easier to remove things you don't need then to add them back in.

## Build for Delphi
Run `npm run build-fr` to build the project for use with Delphi applications. 
The build artifacts will be stored in the `dist/` directory.
The point is that a specific base-href is used.

## Build for Asp.Net
Run `ng build` to build the project for use with Asp.Net web applications. 
The build artifacts will be stored in the `dist/` directory.
No specific base-href should be used!

## Running from Delphi app

The Delphi application, e.g. FR69, can serve this Angular client application.
You need to configure the path to the dist folder in the ini file, e.g in FR69.ini.
Then point your browser (Chrome) at the home page and find the link.
The Delphi app will tell you where the ini file is located and what the Url of the home page is.

The ini file of the Delphi application may look similar to this example:
```
[Connections]
Host=localhost
PortIn=3427
PortOut=3428
AngularFR=D:\Angular\FR03A1\dist\FR03A1
AngularFREO=D:\Angular\FR03E1\dist\FR03E1
AngularFRAC=D:\Angular\FR05J\dist\FR05J
WebServerHost=localhost
WebServerHomePort=8086
WebServerRemotePort=8086
```
You need to update the value of the AngularFREO key and then surf to WebServerHost at WebServerHomePort.
Sometimes you want to set up WebServerHost to the real IP address of the machine the Delphi app is running on, or just the machine name.

## Running from Asp.Net web application

When testing locally you can configure the path to the dist folder in the Startup.cs of the Asp.Net Core web application.

Inside the ConfigureServices method your code will look similar to this:
```
    // In production, the Angular files will be served from this directory
    services.AddSpaStaticFiles(configuration =>
    {
        configuration.RootPath = "D:/Angular/FR03E1/dist/FR03E1";
        //configuration.RootPath = "ClientApp";
    });

```

Then add a link to localhost:port/index.html somewhere, which will load the Angular app.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build for layout testing

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running lint

Run `ng lint` to do linting.
I have set some properties in tslint.json to false so that it passes.

```
comment-format
no-inferrable-types
```

## Status

FR03E1 should be usable in Chrome on the desktop while you are connected to a test server application located within the same local area network as the browser. Everything else needs to be done.