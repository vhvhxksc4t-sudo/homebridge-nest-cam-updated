# homebridge-nest-cam-updated

View your Nest cams in HomeKit using [Homebridge](https://github.com/homebridge/homebridge) with this plugin.

This is a maintained fork of [homebridge-nest-cam](https://github.com/Brandawg93/homebridge-nest-cam) by Brandawg93, updated for Node 22+ and Homebridge 2.x.

[![npm](https://img.shields.io/npm/v/homebridge-nest-cam-updated?logo=npm)](https://www.npmjs.com/package/homebridge-nest-cam-updated)
[![Build](https://github.com/vhvhxksc4t-sudo/homebridge-nest-cam-updated/actions/workflows/npmbuild.yml/badge.svg)](https://github.com/vhvhxksc4t-sudo/homebridge-nest-cam-updated/actions/workflows/npmbuild.yml)

## Notes
- This plugin works with **legacy Nest cameras** connected to a Google account. If your camera does not appear in the Nest section of the Google Home app, it will not work with this plugin. For newer Google Nest cameras, see [homebridge-google-nest-sdm](https://github.com/potmat/homebridge-google-nest-sdm).
- Google account authentication only. Legacy Nest account (issueToken/cookies) is not supported.

## Installation
1. Install via Homebridge UI (search `homebridge-nest-cam-updated`) or run: `npm install -g homebridge-nest-cam-updated`
2. Use the plugin's setup UI to sign in with your Google account, or configure manually (see below)
3. Restart [Homebridge](https://github.com/homebridge/homebridge)

### Upgrading from homebridge-nest-cam
Your existing `config.json` platform block is fully compatible — the platform name is still `Nest-cam`. No changes needed.

### FFmpeg
By default, `libx264` is used as the h264 encoder. If you would like to use a hardware-accelerated encoder instead, refer to the [h264 Hardware Encoders Wiki](https://github.com/Brandawg93/homebridge-nest-cam/wiki/h264-Hardware-Encoders).

## Configuration

### Via Homebridge UI
Open the plugin settings and follow the Google sign-in flow. Your refresh token will be saved automatically.

### Manual (config.json)
Add a `refreshToken` obtained via the [manual authentication method](https://github.com/Brandawg93/homebridge-nest-cam/wiki/Manual-Authentication):

```json
{
    "platform": "Nest-cam",
    "refreshToken": "1//01T_...",
    "options": {
      "ffmpegCodec": "libx264",
      "motionDetection": true,
      "streamingSwitch": true
    }
}
```

### Options

| Name              | Description                                                         | Type             |
|-------------------|---------------------------------------------------------------------|------------------|
| ffmpegCodec       | The video codec to use for FFmpeg                                   | string           |
| streamQuality     | The quality of the stream from LOW to HIGH                          | number (1-3)     |
| alertCheckRate    | How often to check for alerts                                       | number (seconds) |
| alertCooldownRate | How long between consecutive alert notifications                    | number (seconds) |
| alertTypes        | What type of alerts to receive                                      | array            |
| importantOnly     | Only send notifications on events considered important              | boolean          |
| motionDetection   | Enable/disable the motion sensors                                   | boolean          |
| doorbellAlerts    | Enable/disable doorbell ring notifications                          | boolean          |
| doorbellSwitch    | Enable/disable doorbell automation switch                           | boolean          |
| streamingSwitch   | Enable/disable the ability to turn the camera on or off             | boolean          |
| chimeSwitch       | Enable/disable the ability to turn the doorbell chime on or off     | boolean          |
| audioSwitch       | Enable/disable the ability to turn the camera audio on or off       | boolean          |
| pathToFfmpeg      | Specify the path to a custom FFmpeg binary                          | string           |
| cameras           | Specify the camera UUIDs of which cameras to show                   | array            |
| structures        | Specify the structure IDs of which structures' cameras to show      | array            |

## Features
- View cameras within HomeKit
- Receive notifications and set automations for motion or doorbell rings
- Receive notifications for specific motion event types
- Listen and talk back to people on equipped cameras
- Enable/disable the indoor chime on Nest Hello doorbells

## Credits
Original plugin developed by [Brandawg93](https://github.com/Brandawg93), originally based on work by [KhaosT](https://github.com/KhaosT).

Converted to TypeScript using [homebridge-ring](https://github.com/dgreif/ring) and [homebridge-examples](https://github.com/homebridge/homebridge-examples).

---

<sub><sup>**Disclaimer:** This plugin and its contributors are not affiliated with Google LLC or Nest Labs in any way.</sub></sup>
