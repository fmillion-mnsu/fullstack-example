# Set an environment flag so we can detect downstream that the package is being installed
# This addresses import failures for VERSION when deps aren't yet installed.
import os
os.environ['IN_SETUP_PY'] = "1"

from metadata import META

# Try to import the version file
import importlib
try:
    VERSION = importlib.import_module(f"{META['appPackage']}._version").VERSION
except ImportError:
    print("ERROR: Could not read version.")
    print(f"Did you ensure that your code is contained within the {META['appPackage']} namespace?")
    exit(1)

import setuptools

setuptools.setup(
    name=META['appName'],
    version=VERSION,
    url="https://www.github.com/",
    author="Your Name",
    author_email="your.email@gmail.com",
    description=META['appDescription'],
    packages=setuptools.find_namespace_packages(),
    install_requires=[
        "flask==2.3.2",
        "peewee==3.17.1",
        "python-dotenv==1.0.0",
        "urllib3==2.0.3",
    ],
    classifiers=[
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.11',
    ],
    include_package_data=True,
    package_data = {},
    entry_points = {
        'console_scripts': [
            f'{META["appName"]}={META["appPackage"]}.__main__:main',
        ],
    }
)