import i18n from '../../lang'
const kvm_vga_drivers = [
  {
    value: '',
    label: i18n.global.t('common.default'),
  },
  {
    value: 'std',
    label: 'Standard VGA',
  },
  {
    value: 'vmware',
    label: 'VMware compatible',
  },
  {
    value: 'qxl',
    label: 'SPICE',
  },
  {
    value: 'qxl2',
    label: 'SPICE dual monitor',
  },
  {
    value: 'qxl3',
    label: 'SPICE three monitors',
  },
  {
    value: 'qxl4',
    label: 'SPICE four monitors',
  },
  {
    value: 'serial0',
    label: 'Serial terminal 0',
  },
  {
    value: 'serial1',
    label: 'Serial terminal 1',
  },
  {
    value: 'serial2',
    label: 'Serial terminal 2',
  },
  {
    value: 'serial3',
    label: 'Serial terminal 3',
  },
  {
    value: 'virtio',
    label: 'VirtIO-GPU',
  },
  {
    value: 'none',
    label: 'none(none)',
  },
]
const render_scsihw = [
  {
    value: '',
    label: i18n.global.t('common.default') + ' (LSI 53C895A)',
  },
  {
    value: 'lsi',
    label: 'LSI 53C895A',
  },
  {
    value: 'lsi53c810',
    label: 'LSI 53C810',
  },
  {
    value: 'megasas',
    label: 'MegaRAID SAS 8708EM2',
  },
  {
    value: 'virtio-scsi-pci',
    label: 'VirtIO SCSI',
  },
  {
    value: 'virtio-scsi-single',
    label: 'VirtIO SCSI single',
  },
  {
    value: 'pvscsi',
    label: 'VMware PVSCSI',
  },
]
const render_qemu_bios = [
  {
    value: '',
    label: i18n.global.t('common.default'),
  },
  {
    value: 'seabios',
    label: 'SeaBIOS',
  },
  {
    value: 'ovmf',
    label: 'OVMF (UEFI)',
  },
]
const render_machine = [
  {
    value: '',
    label: i18n.global.t('common.default'),
  },
  {
    value: 'virt',
    label: 'virt',
  },
  {
    value: 'pc',
    label: 'i440fx',
  },
  {
    value: 'q35',
    label: 'q35',
  },
]
const network_card = [
  {
    value: 'e1000',
    label: 'Intel E1000',
  },
  {
    value: 'virtio',
    label: 'VirtIO (' + i18n.global.t('common.paravirtualized') + ')',
  },
  {
    value: 'rtl8139',
    label: 'Realtek RTL8139',
  },
  {
    value: 'vmxnet3',
    label: 'VMware vmxnet3',
  },
]
const task_descriptions = {
  vncshell: ['', 'Shell'],
  startall: ['', i18n.global.t('control.startall')],
  stopall: ['', i18n.global.t('control.stopall')],
  qmclone: ['VM', i18n.global.t('control.clone')],
  qmconfig: ['VM', i18n.global.t('control.configure')],
  qmcreate: ['VM', i18n.global.t('control.createvm')],
  qmdestroy: ['VM', i18n.global.t('control.destroy')],
  qmigrate: ['VM', i18n.global.t('control.migrate')],
  hamigrate: ['HA', i18n.global.t('control.migrate')],
  qmmove: ['VM', i18n.global.t('control.movedisk')],
  qmpause: ['VM', i18n.global.t('control.pause')],
  qmreboot: ['VM', i18n.global.t('control.reboot')],
  qmreset: ['VM', i18n.global.t('control.reset')],
  qmresume: ['VM', i18n.global.t('control.resume')],
  qmshutdown: ['VM', i18n.global.t('control.shutdown')],
  qmstart: ['VM', i18n.global.t('control.start')],
  hastart: ['HA', i18n.global.t('control.start')],
  qmstop: ['VM', i18n.global.t('control.stop')],
  qmsuspend: ['VM', i18n.global.t('control.hibernate')],
  qmtemplate: ['VM', i18n.global.t('control.convtemplate')],
  vncproxy: ['VM', i18n.global.t('control.console')],
  clusterjoin: ['', i18n.global.t('control.joincluster')],
  clustercreate: ['', i18n.global.t('control.createcluster')],
  migrateall: ['', i18n.global.t('control.migrateall')],
  imgcopy: ['', i18n.global.t('control.copydata')],
  imgdel: ['', i18n.global.t('control.erasedata')],
  download: ['', i18n.global.t('control.downloadimage')],
  initgpu: ['', i18n.global.t('control.initiate') + ' GPU'],
  uninitgpu: ['', i18n.global.t('control.hosttakeover') + ' GPU'],
  qmsnapshot: ['VM', i18n.global.t('common.snapshot')],
  qmdelsnapshot: ['VM', i18n.global.t('control.deletesnapshot')],
  qmrollback: ['VM', i18n.global.t('control.rollback')],
}
const disk_format = [
  {
    value: 'raw',
    label: i18n.global.t('createvm.raw') + '(raw)',
  },
  {
    value: 'qcow2',
    label: i18n.global.t('createvm.qcow2') + '(qcow2)',
  },
  {
    value: 'vmdk',
    label: i18n.global.t('createvm.vmdk') + '(vmdk)',
  },
]
const network_iface_types = {
  eth: i18n.global.t('common.networkdevice'),
  bridge: 'Linux Bridge',
  bond: 'Linux Bond',
  vlan: 'Linux VLAN',
  OVSBridge: 'OVS Bridge',
  OVSBond: 'OVS Bond',
  OVSPort: 'OVS Port',
  OVSIntPort: 'OVS IntPort',
}
const storage_type = {
  dir: i18n.global.t('common.directory'),
  lvm: 'LVM',
  nfs: 'NFS',
  iscsi: 'iSCSI',
  rbd: 'RBD',
  cephfs: 'CephFS',
}
const content_types = {
  images: i18n.global.t('common.diskimage'),
  backup: i18n.global.t('common.VZDumpbackupfile'),
  vztmpl: i18n.global.t('common.containertemplate'),
  iso: i18n.global.t('createvm.isoimage'),
  rootdir: i18n.global.t('common.container'),
  snippets: i18n.global.t('common.snippets'),
}
const hash_algorithm = [
  {
    value: 'default',
    label: 'None',
  },
  {
    value: 'md5',
    label: 'MD5',
  },
  {
    value: 'sha1',
    label: 'SHA-1',
  },
  {
    value: 'sha224',
    label: 'SHA-224',
  },
  {
    value: 'sha256',
    label: 'SHA-256',
  },
  {
    value: 'sha384',
    label: 'SHA-384',
  },
  {
    value: 'sha512',
    label: 'SHA-512',
  },
]
const theme_list = [
  {
    value: 'default',
    label: i18n.global.t('common.default'),
  },
  {
    value: 'color2',
    label: i18n.global.t('common.darkblue'),
  },
]
export {
  kvm_vga_drivers,
  render_scsihw,
  render_qemu_bios,
  render_machine,
  network_card,
  task_descriptions,
  disk_format,
  network_iface_types,
  storage_type,
  content_types,
  hash_algorithm,
  theme_list,
}
