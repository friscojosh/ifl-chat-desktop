# IFL Chat for Linux

IFL Chat is the International Fantasy League's league chat app. Downloads, help and other platforms: <https://iflgm.com/apps>.

## Install

If you installed the `.deb` package, IFL Chat is in your applications menu and ready to use.

Otherwise, extract the archive to a directory of your choice (for example `/opt/ifl-chat`; it also contains this README) and follow the steps below.

### Desktop launcher

Run the script to create a `com.iflgm.chat.desktop.desktop` file (it also registers `iflchat://` links, used to finish signing in with iflgm.com):

```sh
/opt/ifl-chat/create_desktop_file.sh
```

Then move it to your desktop environment's applications directory, for example for the current user:

```sh
mv com.iflgm.chat.desktop.desktop ~/.local/share/applications/
```

### Terminal command

To launch IFL Chat from a terminal, add its directory to your `PATH` (for example in `~/.bashrc`):

```sh
export PATH=$PATH:/opt/ifl-chat
```

or create a symbolic link:

```sh
sudo ln -s /opt/ifl-chat/ifl-chat /usr/local/bin/ifl-chat
```

## Using IFL Chat

IFL Chat opens the league's chat at https://chat.iflgm.com; there is no server to set up. Choose **Sign in with iflgm.com** and finish signing in in your browser. Questions go to the commissioner.

## License

IFL Chat is built on Mattermost Desktop, open source software under the Apache License, Version 2.0 (see `LICENSE.txt` and `NOTICE.txt`).
