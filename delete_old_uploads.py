######################################
# This script deletes all files
# inside the '/tmp/happify/' directory
# as configured in the flask app
# if they have not been modified
# within the last preserve_for_seconds
######################################

import os
from time import time
import app

######################################
# CONFIG
######################################
preserve_for_seconds = 30

######################################
# INTERNAL
######################################

if(os.path.isdir('/tmp/happify/')):
    os.chdir('/tmp/happify/')
    files = os.listdir('.')
    for theFile in files:
        try:
            seconds_since_creation = time() - os.path.getmtime(theFile)
            if os.path.isfile(theFile) and seconds_since_creation >= preserve_for_seconds:
                os.unlink(theFile)
        except Exception as e:
            print e
