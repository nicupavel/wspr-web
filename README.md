# WSPR Web

Tracks [WSPR](<https://en.wikipedia.org/wiki/WSPR_(amateur_radio_software)>) callsigns on map with 4 pairs extra precision (8 characters) [Maidenhead](https://en.wikipedia.org/wiki/Maidenhead_Locator_System) (adding the extended square).
Improved location precision means going from (example) **CN83MU** to **CN83MU73**.

![wspr-web](https://github.com/nicupavel/wspr-web/assets/1650801/42898b0d-8ecb-4340-b41a-e9849ab116dc)

## Online version

You can see the online version at [wspr.12v.com](https://wspr.12v.com)
## WSPR encoding

This project uses a different encoding technique to add extra location precision in the WSPR packets. The extra location is encoded in the power level (dBm) part of the
packets in 2 consecutive transmissions (type 2). First transmission will encode the 7th Maidenhead and the second the 8th Maidenhead.
If your WSPR transmitter doesn't encode extra location and sends plain power level the tracking with either not show anything (if dBm is always constant) or show incorect
positioning.

## Example firmware changes:

See code in example [firmware](firmware/WSPR_TX2_19_precision.ino). Function that does encoding is `encodeIndexAsdBm`.

## Project Setup

```sh
npm install
npm run dev
```
