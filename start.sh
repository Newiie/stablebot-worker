#!/bin/bash
echo "███╗░░░███╗░█████╗░░██████╗████████╗███████╗██████╗░"
echo "████╗░████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗"
echo "██╔████╔██║███████║╚█████╗░░░░██║░░░█████╗░░██████╔╝"
echo "██║╚██╔╝██║██╔══██║░╚═══██╗░░░██║░░░██╔══╝░░██╔══██╗"
echo "██║░╚═╝░██║██║░░██║██████╔╝░░░██║░░░███████╗██║░░██║"
echo "╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═════╝░░░░╚═╝░░░╚══════╝╚═╝░░╚═╝"
REMOVE_IMAGES=false
# Iterate through arguments
for arg in "$@"
do
    case $arg in
        --remove-images)
            REMOVE_IMAGES=true
            shift
            ;;
        *)
            echo "Unknown option: $arg"
            ;;
    esac
done

if $REMOVE_IMAGES; then
    if [ "$(docker images -q)" != "" ]; then
        echo "Removing All docker images"
        docker stop $(docker ps -a -q)
        docker rmi $(docker images -a -q) -f
    else
        echo "No docker images found"
    fi
fi
DOCKER_TAG_NAME="stablebot"
echo "Building docker image"
docker build -t $DOCKER_TAG_NAME . 
echo "Deploying Stable Bot"
docker run -d  $DOCKER_TAG_NAME