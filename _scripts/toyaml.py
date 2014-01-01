# Converts my hacked front matter to YAML.
import utils
import re
import os.path

def fix_file(path):
    with open(path, 'r') as input:
        content = input.read()

        basename = os.path.relpath(path, '_posts')
        basename = basename.split('.')[0]
        date = basename.replace('-', '/')
        print date

        # Parse the title and link
        if 'permalink = ' in content:
            content = re.sub('^title = ([^\n]+)\npermalink = ([^\n]+)\ntags = ([^\n]+)\n',
                r'---\ntitle: \1\ntags: \3\npermalink: \2\ndate: ' + date + r'\n',
                content)
        else:
            content = re.sub('^title = ([^\n]+)\ntags = ([^\n]+)\n',
                r'---\ntitle: \1\ntags: \2\ndate: ' + date + r'\n',
                content)

        # Save the file back out
        with open(path, 'w') as output:
            output.write(content)

utils.walk('_posts', fix_file, '.md')
