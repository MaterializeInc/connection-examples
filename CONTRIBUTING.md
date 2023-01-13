# Contributing to Materialize Connection Examples

Thank you for your interest in Materialize connection examples!
Contributions of many kinds are encouraged and most welcome.

## Pull requests

We welcome pull requests from everyone. By participating in this project, you
agree to abide by the [code of conduct](CODE_OF_CONDUCT.md).

Fork, then clone the repo:

```
git clone https://github.com/MaterializeInc/connection-examples.git
```

Create a branch for your edits:

```
git checkout -b my-branch
```

### Contributing a new example

Run the init script to create the default secrets file:

```bash
bash .github/scripts/init.sh
```

The script will prompt you for the following information:
- `Programming language`: The name of the programming language or framework
- `File extension`: The file extension for the language or framework

The script will create a new directory with the name of the language or framework
and add template files where you can add your code.

Once you have added your code, commit your changes and push to your fork:

```
git add .
git commit -m "Add my example"
git push origin my-branch
```

Then submit a pull request through the GitHub website.

## Issues

If you have questions, please [create a GitHub issue](https://github.com/MaterializeInc/connection-examples/issues/new).
