

``` bash
#this is a cli fast to create .vue file and import in router auto

# install 
npm install -g v-cli

# run
switch terminal work path same with the path of package.json of project.

# check version
v-cli -version

# get help
v-cli -h


# src/components、src/components、src/router/index.js must be exists first
#create test.vue file in src/components/,the final path is src/components/test/test.vue
v-cli -c=test


#create test.vue file in src/views/,the final path is src/views/test/test.vue
v-cli -v=test


#create test.js file in src/api/,the final path is src/api/test.js
v-cli -r=test


#create above files
v-cli -a=test