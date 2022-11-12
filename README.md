## 1password-postman-integration

## Description 
 * Provide a high-level description of your application and it's value from an end-user's perspective
 * What is the problem you're trying to solve?
 * Is there any context required to understand **why** the application solves this problem?

## Key Features
 * Described the key features in the application that the user can access
 * Provide a breakdown or detail for each feature that is most appropriate for your application
 * This section will be used to assess the value of the features built

The key feature is enabling the automation of the loading of the client’s API_KEY: API_SECRET_VALUE pair from 1Password cli into Postman API request, avoid the copy/paste routine mentioned error by client, such that subsequent developer API requests would be pre-populated with the secret.

## Instructions
 * Clear instructions for how to use the application from the end-user's perspective
 * How do you access it? Are accounts pre-created or does a user register? Where do you start? etc. 
 * Provide clear steps for using each feature described above
 * This section is critical to testing your application and must be done carefully and thoughtfully
 
 ## Development requirements
 * If a developer were to set this up on their machine or a remote server, what are the technical requirements (e.g. OS, libraries, etc.)?
 * Briefly describe instructions for setting up and running the application (think a true README).
 
 ## Deployment and Github Workflow
 
 We wanted our team’s developer workflow to follow at least the following requisites; efficiently implement incremental changes, asynchronous development, reduce blockers and timely feedback. These requisites enable our team to share a codebase, avoid conflicts and deploy the mvp locally. 

Firstly, our team was able to share the mvp codebase with the version control GIT and the code hosting platform GitHub. Each team member would be responsible for obtaining and maintaining a local copy of the repository. At a high level, each team member would ‘clone’ the remote repository onto their local machine, then maintain their local repository by ‘pulling’ the latest remote master branch into your current branch. Alternatively, each team member was recommended to instead maintain their local repository by ‘rebasing’ your current changes by updating your local branch with the most up to date master branch. This method was preferred since this streamlines our main branch into 1 uniform branch, making it easier to rollback a feature and having a more readable branch history.

Secondly, our team avoided conflicts by integrating with the feature branch developer workflow that was mentioned during class. Leveraging this workflow paradigm enabled us to  separate different features from the main code base. Unlike a centralised workflow (developers push and pull from the same master branch), we aren't pushing and pulling from the same repo. Rather, we independently make changes in a "sandboxed" feature branch that is then reviewed and merged into the remote master branch. Ultimately, this makes continuous integration easier since team members can work on prototypes without compromising the central working master branch. To add on, whenever a team member makes a pull request to merge their remote feature branch into the remote master branch, it requires at least 1 code review from another member on the team. We only required a single code review as we believed the complexity of the mvp did not warrant more than 1 code review and requiring more than 1 code review will slow down our code throughput. Finally, if a developer is concerned about which changes to accept during a merge conflict, he/she is encouraged to look at the Git blame of the file(s) involved in the conflict and to individually contact the team member you have a conflict with.

Finally, due to the strict requirements from our partner 1Password(not to be deployed on an externally hosted server; must interact directly with the client machine) we were unable to deploy our mvp. However, we were still able to follow continuous integration by leveraging GitHub actions. At a high level, this tool enables us to build & automatically run tests for the mvp on a remote server. This becomes very useful when a developer opens a pull request( how are we able to guarantee each pull request can be successfully merged into the remote master?). For every pull request, GitHub will run our CI build configuration file to assert whether the feature branch is eligible to be merged with the remote master branch. Once CI asserts true for all the checks, the developer can now request a code review from another developer on the team. After a successful code review, the developer’s feature branch finally gets merged into the remote master branch(source of truth). It is highly encouraged on our team to run our custom test script before a pull request is made(making a pull request with failing tests will not pass CI).

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Based on the need, we choose MIT license. Since MIT license perfectly matches with both 1Password and our team needs, it allows both commercial and private use, poeple can modify based on that for personal use. However, the copyrught and license myst be included with the licensed material. The limitation is that no warranty is not provided and liability.