# Setup

For this tool to work, you must enable the HTTP web interface for VLC. This can be done by opening Settings, and enabling "HTTP Web Interface" on the interfaces tab. It is reccomended that you set a password here.

# Configuration

For the tool to work, you must set the following configuration fields in a `.env` file

```env
VLC_PASSWORD=your_password          # The password you set for the HTTP interface
```

optionally you my also configure this value:

```env
VLC_HOST=http://localhost:8080      # Usually this is the correct default
UPDATE_DELAY=5000                   # Delay between polling VLC for updates in ms
```
