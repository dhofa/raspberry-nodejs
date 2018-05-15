import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

buzz=18

GPIO.setup(buzz, GPIO.OUT)

def buzzer(pitch,duration):
    if(pitch==0):
        time.sleep(duration)
        return
    period = 1.0/pitch
    delay=period/2
    cycles=int(duration*pitch)

    for i in range(cycles):
        GPIO.output(buzz,1)
        time.sleep(delay)
        GPIO.output(buzz,0)
        time.sleep(delay)

def play(tune):
 x=0
 if tune == 1: #happy birthday
  pitch=[131,131,147,131,175,165,0,131,131,147,131,196,165,0,131,131,262,220,175,175,165,147,0,233,233,220,175,196,175]
  duration=[0.2,0.2,0.4,0.4,0.4,0.8,0.2,0.2,0.2,0.4,0.4,0.4,0.8,0.2,0.2,0.2,0.4,0.4,0.2,0.2,0.4,0.4,0.4,0.2,0.2,0.4,0.4,0.4,0.4]
  for p in pitch:
   buzzer(p,duration[x])
   time.sleep(duration[x] *0.5)
   x += 1
 if tune == 0: #Stop playing
  pitch=[131]
  duration=[0]
  for p in pitch:
   buzzer(p,duration[x])
   time.sleep(duration[x] *0.5)
   x += 1

try:
    while True:
#        a=input("enter tune number? ")
#        time.sleep(1)
        play(1)

except KeyboardInterrupt:
    GPIO.cleanup()
