# NatureGram
Endless scroll of inaturalist observations

![home](readmephotos/home.png)
![following](readmephotos/following.png)
![naturalist](readmephotos/naturalist.png)
![comments](readmephotos/comments_wide.png)

## Built With
* Angular
* Clarity
* iNaturalist API

# Prereq
podman

## Setup 

```bash
#Build container image (This repo includes a Containerfile) 
podman build -t angular:alpine .

#Install dependencies
./run npm install

#Build and serve
./run ng serve 
```

