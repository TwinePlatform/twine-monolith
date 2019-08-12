# Setup

## Contents

1. [Pre-requisites](#prerequisites)
1. [Getting started](#getting-started)
1. [Applications](#applications)

## Pre-requisites
* `node` (v10.2.0+) and `npm` (v6+)
* `lerna` (v3+)
* `postgresql` (v10+)

## Getting Started
Clone the monorepo with `https` or `ssh`:

```sh
# https
git clone https://github.com/TwinePlatform/twine-monolith.git
```

```sh
# ssh
git clone git@github.com:TwinePlatform/twine-monolith.git
```

After cloning, `cd` into the repo's root directory and install dependencies:
```sh
lerna bootstrap
```

## Applications
For further instructions on setting up each application locally, see each application's setup docs:

* [API](../api/docs)
* [Volunteer Dashboard](../dashboard-app/docs)
* [Visitor app](../visitor-app/docs)
* [Volunteer app](../volunteer-app/docs)
* [Temporary Admin Dashboard](../temp-admin-dashboard-app/docs)
