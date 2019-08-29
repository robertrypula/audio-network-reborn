// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export class ApplicationLayer {}

/*
current DataLinkLayer: header 3 bytes, fixed 8 bytes

le th 33 44 55 66
11 22 33 44 55 66
11 22 33 44 55 66
11 22 33 44 55 66
11 22 33 44 55 66
11 22 33 44 55 66
re ed so lo mo nn

1054 B = 31 blocks
1 block = 7 frames = 34 data bytes
1 frame = 11.5 raw bytes (HH HH HH DD DD 11 22 33 44 55 66)

---

1054 B = 2495.5 raw bytes
It takes 166.4 seconds to send 1054 B @ 15 B/s
It means that real speed is 6.33 B/s

----------------------------------------------------

proposed DataLinkLayer: header 2 bytes, fixed 10 bytes

le th 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
re ed so lo mo nn __ __

1054 B = 17 blocks
1 block = 9 frames = 62 data bytes
1 frame = 12.5 raw bytes (HH HH DD DD 11 22 33 44 55 66 77 88)

---

1054 B = 1912.5 raw bytes
It takes 127.5 seconds to send 1054 B @ 15 B/s
It means that real speed is 8.27 B/s

----------------------------------------------------

proposed DataLinkLayer: header 2 bytes, fixed 9 bytes

LE CR CC RC 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88
11 22 33 44 55 66 77 88

1080 B = 18 blocks
1 block = 8 frames = 60 data bytes
1 frame = 11.5 raw bytes (HH HH DD 11 22 33 44 55 66 77 88)

---

1080 B = 1656 raw bytes
It takes 110.4 seconds to send 1080 B @ 15 B/s
It means that real speed is 9.78 B/s
*/
