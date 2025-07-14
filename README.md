# `demo-auth-jwt-nestjs-react`

<p align="left">
    <img src="https://img.shields.io/badge/Node.js-339933.svg?style=flat-square&logo=Node.js&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat-square&logo=Docker&logoColor=white" alt="Docker">
    <img src="https://img.shields.io/badge/NestJS-E0234E.svg?style=flat-square&logo=NestJS&logoColor=white" alt="NestJS">
    <img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat-square&logo=React&logoColor=white" alt="React">
    <img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat-square&logo=Vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Vitest-6E9F18.svg?style=flat-square&logo=Vitest&logoColor=white" alt="Vitest">
    <img src="https://img.shields.io/badge/Mikro%20ORM-316585.svg?style=flat-square&logo=typeorm&logoColor=white" alt="Mikro ORM">
    <img src="https://img.shields.io/badge/Passport-34E27A.svg?style=flat-square&logo=Passport&logoColor=white" alt="Passport">
    <img src="https://img.shields.io/badge/JWT-000000.svg?style=flat-square&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
</p>

A simple demo project using NestJS and React, showcasing JWT-based authentication with a focus on modularity and scalability.

See it live:

-   [Backend](https://demo-auth-api.mszanowski.com)
-   [Backend (docs)](https://demo-auth-api.mszanowski.com/docs)
-   [Frontend](https://demo-auth.mszanowski.com)

## Architecture

This project is built using a microservices architecture, leveraging NestJS for the backend and React with Vite for the frontend. Although it's structured more like a monorepo, it maintains a clear separation of concerns between each service. It's relatively easy to split this repository into smaller parts or add other independent services (e.g. with git submodules) without affecting the overall functionality.

As mentioned, every service works independently, allowing for modular development and deployment, even in large teams. Each service can be developed, tested, deployed, and scaled independently, which is a key advantage of this architecture. For the simplicity of this demo, we're utilizing Docker and Docker Compose. In a real world scenario, we'd likely use a more complex orchestration tool like Kubernetes (e.g. with ArgoCD), preferably over a cloud provider like AWS, GCP, or Azure. We'd also use a CI/CD pipeline to fully automate the deployment process, ensuring that each service can be deployed independently without affecting the others, also allowing for rolling updates and zero downtime deployments. We may also consider extracting some services into cloud (e.g RDS for databases, S3 for file storage, SQS for message queues etc.) to further enhance scalability and reliability.

Services that may want to use shared code (e.g. shared types, interfaces, configurations, etc.) may want to implement a shared library, which can be easily imported into each service. This allows for easy sharing of code between services, while still maintaining the modularity and independence of each service. The shared library can be developed, tested, and deployed independently, allowing for easy updates and changes without affecting the other services. Most reliable way to do this would be to use git submodules or to create a separate shared service.

### Backend

Built using NestJS, alongside with TypeScript and ESM. It is responsible for handling authentication and authorization, user management, and other core functionalities. It uses Mikro-ORM as its ORM library, providing strict and powerful, yet relatively simple to use way to interact with most of the leading databases. It serves a documentation website (Swagger) with automatically generated OpenAPI specification based on code annotations. The service utilizes Passport.js, implementing JWT-based authentication and authorization, also with the token refresh functionality. The backend service itself is structured into modules, each responsible for a specific functionality (e.g. `auth`, `user`, `config` etc.). This modularity allows for easy maintenance and scalability of this particular service, while also allowing for easy integration with other services in the future. It should also be relatively easy to split this main (for now) service into smaller, independent services, each responsible for a specific functionality. This would allow for even greater modularity and scalability, as each service could be developed, tested, deployed, and scaled independently. The service is designed to be stateless, allowing for horizontal scaling and easy deployment in cloud environments. It is also designed to be easily testable, with unit and integration tests. Altough the coverage is nearly 100%, in a real world scenario we would also add end-to-end and performance tests and include all of them within the CI/CD pipeline to ensure the reliability and performance of each service. It's worth mentioning that Vitest was choosed over Jest mostly due to compatibility with ESM, but also because of its performance and simplicity. It's also possible to use it in frontend apps, so the stack remains more consistent across the whole project.

Detailed information about the service can be found in its [README](services/backend/README.md) file.

### Frontend

Built using React with Vite, alongside with TypeScript. It's more like a mockup app just to showcase the authentication flow, but it can be easily extended to include more features. It uses Ant Design as its UI library, providing a modern and responsive design. The frontend service is responsible for handling user interactions, displaying user data, and communicating with the backend service via REST API. It generates ready-to-use API client code using OpenAPI specification, which is automatically generated by the backend service. This allows for easy integration with the backend service and ensures that the frontend service is always up-to-date with the latest API changes. The frontend service is designed to be modular, allowing for easy maintenance and scalability. It is also designed to be easily testable, with unit tests and integration tests. In a real world scenario we would also add end-to-end tests within the CI/CD pipeline to ensure the reliability and performance of the service.

Detailed information about the service can be found in its [README](services/frontend/README.md) file.

**Note:** Due to the lack of frontend development experience and a fact that I'm more interested in backend development, the frontend service may not be as polished as the backend service. However, it serves as a good starting point for building a more complex application. Read more about what's missing in the [What's missing](#whats-missing) section below.

### Database

There is currently only one database service, which is used by the backend service. It uses PostgreSQL as its database engine, providing a powerful and reliable database solution. The database service is responsible for storing user data, authentication tokens, and other core functionalities. It is designed to be easily scalable and maintainable, with support for migrations and seed data.

## Usage

### Development

You only need to have Docker and Docker Compose installed on your machine. You can find the installation instructions for your operating system on the [Docker website](https://docs.docker.com/get-docker/) and [Docker Compose website](https://docs.docker.com/compose/install/).

The general idea is to use Docker Compose to run all services in separate containers, allowing for complete isolation of each service and its dependencies. This way, you can run the whole project locally on any host machine alongside with any other project, fully isolated from the host system. This is especially useful when working on multiple projects with different dependencies or when you want to avoid conflicts with other services running on your machine. This setup also allows your IDE to pick up the changes, utilize linters, formatters, and any other tools as if you were running the services directly on your machine, while still keeping the isolation of Docker containers. It is highly preferred to run any commands inside the Docker containers, as they are pre-configured with all the necessary dependencies and tools. This way, you can avoid any issues with missing dependencies or incompatible versions of tools.

#### Setting up the environment variables

You need to set up the environment variables for each service. You can find the example environment variables in the `.env.template`. Simply copying the `.env.template` file to `.env` should be enough to get started. However, you may want to adjust some of the values to fit your local environment, such as database connection settings, JWT secret, etc. **The `.env` file should NEVER be committed to the repository, as it contains sensitive information.**.

```bash
cp .env.template .env
```

#### Setting up the Docker Compose override file

You need to create a `docker-compose.override.yml` file. Upon any `docker compose` command, Docker Compose will automatically look for this file and apply its settings on top of the main `docker-compose.yml` file. This allows you to override or extend the default configuration without modifying the main file. The following commands show how to create a symbolic link but keep in mind you can always create the file yourself to adjust your environment.

```bash
ln -s docker-compose.dev.yml docker-compose.override.yml          # macos / linux
cmd /c mklink docker-compose.override.yml docker-compose.dev.yml  # windows
```

#### Building and running

To build and run the project, you can use the following command:

```bash
docker compose up --build
```

You may want to add the `-d` flag to run the containers in detached mode. If you want to force recreation of the containers, you can add the `--force-recreate` flag.

#### Setting up the database

After the services are up and running, you need to run the database migrations to set up the initial database schema. Approach to the migrations will be adjusted in the nearest future as the project evolves, but for now you can run the following command to apply all pending migrations.

```bash
docker compose exec demo-backend npx mikro-orm-esm migration:up
```

Besides that, you can also seed the database with some initial data, such as admin user, roles, etc. This is useful for testing purposes and to have a working application out of the box. You can run the following command to seed the database:

```bash
docker compose exec demo-backend npx mikro-orm-esm seeder:run
```

If the backend service didn't trigger the hot reload at this point, you can manually restart the container to ensure that the database-related changes are picked up:

```bash
docker compose restart demo-backend
```

#### Testing

There are predefined node scripts in each service's `package.json` that can be used to run variety of tests, such as unit tests, integration tests, and end-to-end tests. This should also be relatively easy to create a simple shell script to handle all the testing. For now, since the testing setup is not as complex as intended, you can run all the tests for a particular service with a single command:

```bash
docker compose exec demo-backend npm run test:watch
docker compose exec demo-frontend npm run test:watch
```

There's also a Vitest UI that, once started (with the script above), can be accessed via the browser at `http://localhost:<port>/__vitest__`. If you don't know what's your `port`, see `docker-compose.override.yml` you've just created. You can use this tool to also trigger all or individual tests manually, view test results, see the coverage and debug your tests.

If you're using VSC, you can use the predefined tasks in the [.vscode/tasks.json](.vscode/tasks.json) file to run the tests directly from your IDE. This allows for a more integrated development experience, as you can run tests, view results, and debug them without leaving your IDE.

#### Debugging

Each service is configured to run in watch mode, allowing for live reloading during development which is sufficient in most cases. However, you can also use the debugger if needed. For that, simply attach your debugger to the running service, that's it. Each service is already configured to expose the debugging port which you can find in the `docker-compose.override.yml` file.

If you're using VSC, you can use the predefined launch configurations in the [.vscode/launch.json](.vscode/launch.json) file.

You can use your IDE's built-in debugger to set breakpoints and step through the code. The services are also configured to automatically reload when you make changes to the code, allowing for a smooth development experience.

#### Helpful links and commands

To access any of the services "by hand", see the `docker-compose.override.yml` file for the ports that are exposed to the host machine. Use appropriate client (e.g. Postman, cURL, browser, pgclient, etc.) to access the services. For example, you can access the frontend service in your browser at `http://localhost:7030`, the backend service's Swagger at `http://localhost:7010/api/docs` or the database service with a PostgreSQL client at `postgres://demo_user:demo_pass@localhost:5432/demo_db`.

##### Documentation

-   [Docker documentation](https://docs.docker.com/)
-   [Docker Compose documentation](https://docs.docker.com/compose/)
-   [NestJS documentation](https://docs.nestjs.com/)
-   [React documentation](https://react.dev/)
-   [Vitest documentation](https://vitest.dev/)
-   [Ant Design documentation](https://ant.design/docs/react/introduce)
-   [PostgreSQL documentation](https://www.postgresql.org/docs/)
-   [OpenAPI documentation](https://swagger.io/docs/specification/about/)
-   [Passport.js documentation](http://www.passportjs.org/docs/)
-   [JWT documentation](https://jwt.io/introduction/)
-   [TypeScript documentation](https://www.typescriptlang.org/docs/)

### Production

In a real world scenario we would use a more complex orchestration tool like Kubernetes and a CI/CD pipeline to fully automate the deployment process. We could also introduce additional environments like staging, pre-prod etc. However, for the simplicity of this demo, I've had deployed the whole project to a single VPS instance using Docker and Docker Compose. The whole project lies behind a reverse proxy (Nginx) and is accessible via HTTPS. The database service is not exposed to the public, but can be accessed by the backend service.

You can also build and run production-ready images of each service using the following command:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build # make sure not to use the override file
```

Please threat the `docker-compose.prod.yml` file as a working template. Copy it to `docker-compose.override.yml` and adjust it to your needs. You can also use it as a starting point for your own production setup, but keep in mind that it is not a complete solution and may require additional configuration and setup.

## What's missing

Due to the fact that this is a demo project, there are some features that are not implemented yet, but are planned for the future. These features are not critical for the authentication flow, but would enhance the overall security and usability of the application. Some of them are:

-   Orchestration tool like Kubernetes for managing the services in production. This would allow for easier scaling, rolling updates, and zero downtime deployments. It would also allow for better resource management and monitoring of the services.
-   Utilization of http-only cookies instead of local storage for storing JWT tokens in the frontend service. This is a more secure way to store tokens, as it prevents XSS attacks from accessing the tokens.
-   Token blacklist functionality to prevent the use of revoked tokens. This is a key feature for ensuring the security of the application, as it allows for immediate revocation of tokens in case of a security breach.
-   Convention for managing git branches, commits, and tags. This is important for maintaining a clean and organized codebase, especially in larger teams. It would also allow for easier collaboration and code reviews.
-   CI/CD pipeline to automate the deployment process. This would allow for faster and more reliable deployments, as well as easier rollback in case of issues.
-   CI/CD pipeline to run tests automatically on each commit. This would ensure that the code is always tested and working, preventing issues from being introduced into the codebase.
-   More comprehensive tests, including end-to-end and performance tests. This would ensure that the application is reliable and performs well under load.
-   Extended access policies for the user roles. This would allow for more granular control over what users can do in the application, enhancing security and usability.
-   User activity tracking to determine if a user is active or not. This would allow for better user experience and security, as it would allow for automatic logout of inactive users.
-   (Frontend only) Refresh token functionality to allow users to stay logged in for longer periods of time without having to re-enter their credentials.
