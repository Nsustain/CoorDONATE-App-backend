export default {
  origin: 'http://localhost:3000',
  accessTokenExpiresIn: 15,
  refreshTokenExpiresIn: 60,
  //   redisCacheExpiresIn: 60,
  //   emailFrom: 'aklile@a2sv.org',

  // accessTokenPrivateKey:
  //   'TUlJQ1hnSUJBQUtCZ1FEQ0VSbHlCa2owQ05aSE05TjEwMzhTSklTRWdHNEc1VmZDSm5tMU1ZVGZJUzU3UWhUSwo3ZHgrS3ZyMGZKUkt0WnBhZUhnNnZtWU80Q1VIVFNzRWVWY0VrNnBaY3hhekFMK2JjWE5EOTJ5c3BKUkJpeTN3Cmd2R3dCMy9QS2RjaWduaElQTHk5bURoRFFuVklYb3lEM0I5NHZLblZBeHEvL3lSb1Rpcld1ZitVSHdJREFRQUIKQW9HQkFKbGxIckhNV2ZuYXlsUzVtRm0zOU9jSVNsN1pqUjZTUlUzSFQ4aHkvYzNJMG83RzZ0eUVLeGJuTGpuMgpCdGtPdHBUd1NFaFdteUVDOXdIUWMwSTBEeHpES1hYekRMZmpNS1dvWUI4L2h0M0lKaHczVnYya0lBSXUreUVsCnkwMjRPY3h6cE1HSHJCRVJjN1NQVWVJR1k2cFZ2QlIxRmpwMFhXZ0RnZUNqdm84eEFrRUE5RlhXMGIvV3JxL2UKNzdWa3BvSWR2NVZrV1dYVmY0YjhneGpGRFh4L2t6QjkrZEs2V3F4ZkZ5VkIwOGtrZ0N3WjJqNCtNLzhUNUpRSwpzNWg0VURPWExRSkJBTXRVNW04bjhBb0dtWHZGNFV0cEVHK3gvdnJmQ250dGNBR0xacnl2eHg4ZXp2MFVSUnFXCjZIWU15OFNaMVl4VlZjM2hOSW5qZHlkRDZhU0dkODU4cC9zQ1FRRGp4R1ZHRUVRcmdlMGJuZ2ZlcEdyZzNuMjIKVEpUU2xkNHN3MWxtTWdtbkIweFlKNVhxMHNhdUIrQXVjbEloWFhzWUZHL2Qvc25uaWczVHo2MVFibGRkQWtBQwpzSjNYekp4MVZYOEVUeXJhMTRuN0lFeXlQdThoa09JUmN5bXB4MTJJQU4xV0pjV0FRNHpSdXZ1Ykh6bmZBR1lCCk1rQ0NybnF1RDB6dyswSnNmZU92QWtFQWgxcTlnRTVUSXRSdUV3RVl6MGpTMnV2VTEzUEZCZS95b3N2WTErelYKYldQbFA5aFZjQzVPa3V2SUlTY3hYRzlpM3AzbWMxRWMrTndVZ0FRNGw0TzBDQT09',
  // accessTokenPublicKey:
  //   'TUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FEQ0VSbHlCa2owQ05aSE05TjEwMzhTSklTRQpnRzRHNVZmQ0pubTFNWVRmSVM1N1FoVEs3ZHgrS3ZyMGZKUkt0WnBhZUhnNnZtWU80Q1VIVFNzRWVWY0VrNnBaCmN4YXpBTCtiY1hORDkyeXNwSlJCaXkzd2d2R3dCMy9QS2RjaWduaElQTHk5bURoRFFuVklYb3lEM0I5NHZLblYKQXhxLy95Um9UaXJXdWYrVUh3SURBUUFC',
  // refreshTokenPrivateKey:
  //   'TUlJQ1hBSUJBQUtCZ1FES3hxbktrSHpaTEdEQnNHeUJZY1RMcEZTa1R1OEtDeGdtK1ZDV1FERURLcVZNU0VKZQpvVFh4QW12NEhIakQ2em5CNVRvYThwZ1ZVdlFsL0FsQXV2ZURDNzFLaStKbmJVaENzREx4S1FpWkFWRnowNW1zCnZnbGkvWVo0V2g0WTNKVFV1S3lQK3pZWE1oekdFSXorUW1RYnJtMkk4TElXcDNUZndMeDh6SUJOUlFJREFRQUIKQW9HQkFKNHJPR1g1TG1sNFpFQ3hEUElmQVJLWHJDNCtJOWNCc0dVMk05WC9YRHZNR0FQWW1XeVc4eXg3Wnh5eAptTUc1eWVPa21oNUsvTFlsYnF2eVhJVlJVWjVReW9sR01vUHZNay9vVFYraytXdDVBcys5aE1PSXpwOGh1S1VhCnVxRjR2dDg5NDBBNitsTFY2QTJtTUNlUUYySDA3S3ZMekMxSHV6aUZleTlwZ3haQkFrRUEvN0s2elNsM1FvOG8KRlNKcmRVYndrdE9NQVV4UU12T1pndzRRSCt2Nk5XTXJDNU00SDY1eXg0WUZSdm12QlYwMGphYTFLYk9TenZwcwpWak02YkdkUFJ3SkJBTXNEOE5waS9rS21NdWtldnFqUVpoTmw1My9Vc0F2QllCeXZWcjQrVVZyK1F6WlhTaFc2Clgxam9KSGpSK290NWpUNzlvUmlGajRZNk1HMlA5eDFDdlJNQ1FHRkNPb3VQR2kzWEJnZ0Q3NXZNUC9XWlFjZTgKbjBUQ0k4SVZ0MHh0RmQ3NHVZYk5tS3QwVDNSVkpleTVURGxlR245R3llSHl6QVN1ZkViTmRZdUdRRUVDUURCVwpPOTZEZTI1N0M5d2RpZCsvM3MzM2tXc0tSUEJIbG82OTRMVmpPUk9sUG5PTnpRSG5ZaFJWRVhvQzVOaVlsRnpQCkhyQXIvTVJFem9zSG9CckRiU2tDUUNaaEkzSEV3UVdUb3F1QUZsV2dxNEpOUHNlRGZWZGo4alBrUEN1T0VNVXcKU1IvSkFDTFhCYzdMbXNFK1dxNWlkcThNOFdvVXJpTklUZmVpRks4aEdVYz0',
  // refreshTokenPublicKey:
  //   'TUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FES3hxbktrSHpaTEdEQnNHeUJZY1RMcEZTawpUdThLQ3hnbStWQ1dRREVES3FWTVNFSmVvVFh4QW12NEhIakQ2em5CNVRvYThwZ1ZVdlFsL0FsQXV2ZURDNzFLCmkrSm5iVWhDc0RMeEtRaVpBVkZ6MDVtc3ZnbGkvWVo0V2g0WTNKVFV1S3lQK3pZWE1oekdFSXorUW1RYnJtMkkKOExJV3AzVGZ3THg4eklCTlJRSURBUUFC',
};
