pkg_origin=tmclaugh
pkg_name=central-registration-nodejs
pkg_version=0.0.1
pkg_maintainer="Tom McLaughlin <tmclaugh@sdf.lonestar.org>"
pkg_license=('MIT')
pkg_upstream_url=https://github.com/tmclaugh/central-registration-nodejs
pkg_source=central-registration-nodejs.tar.gz
pkg_deps=(core/node)
pkg_expose=(8080)

do_download() {
    return 0
}

do_verify() {
    return 0
}

do_unpack() {
    return 0
}

do_build() {
    # This is super simple but it manages to copy some cruft if the work
    # dorectory isn't clean.
    cp -vR $PLAN_CONTEXT/../../bin/ $HAB_CACHE_SRC_PATH/$pkg_dirname
    cp -vR $PLAN_CONTEXT/../../lib $HAB_CACHE_SRC_PATH/$pkg_dirname
    cp -vR $PLAN_CONTEXT/../../package.json $HAB_CACHE_SRC_PATH/$pkg_dirname
    npm install
}

do_install() {
    cp -Rp ./bin/ ${pkg_prefix}
    cp -Rp ./lib ${pkg_prefix}
    cp -Rp ./node_modules ${pkg_prefix}
    cp -Rp ./package.json ${pkg_prefix}
}
