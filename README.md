

``` bash
#this is a cli fast to create .vue file and import in router auto

# install 
npm install -g tpl-mk

# run
switch terminal work path same with the path of package.json of project.

# check version
tpl-mk -version

# get help
tpl-mk -h


# src/components、src/components、src/router/index.js must be exists first
#create test.vue file in src/components/,the final path is src/components/test/test.vue
tpl-mk -c=test


#create test.vue file in src/views/,the final path is src/views/test/test.vue
tpl-mk -v=test


#create test.js file in src/api/,the final path is src/api/test.js
tpl-mk -r=test


#create above files
tpl-mk -a=test