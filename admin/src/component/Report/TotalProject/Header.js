import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { getProjectData } from '../../../store/project/actions';
import { host } from '../../../store';

import style from './Header.module.css';
import { TbChartHistogram } from 'react-icons/tb';
import { BiUpArrowAlt, BiDownArrowAlt } from 'react-icons/bi';

// ==================================================

const Header = () => {
  const dispatch = useDispatch();

  const project = useSelector((state) => state.project);

  const [totalProject, setTotalProject] = useState(0);
  const [totalDeletedProject, setTotalDeletedProject] = useState(0);

  useEffect(() => {
    dispatch(getProjectData());

    axios
      .get(`${host}/api/admin/project/get-all-list`, {
        withCredentials: true,
      })
      .then((res) => setTotalProject(res.data.total))
      .catch((error) => console.log(error));

    axios
      .get(`${host}/api/admin/project/get-deleted-list`, {
        withCredentials: true,
      })
      .then((res) => setTotalDeletedProject(res.data.total))
      .catch((error) => console.log(error));
  }, [dispatch]);

  return (
    <div className={style.container}>
      <div className={style['card-container']}>
        <p className={style.content}>Total project</p>

        <div className={style['total-container']}>
          <p className={style.number}>{totalProject}</p>

          <div className={`${style.increase} ${style['icon-container']}`}>
            <TbChartHistogram />
            1.2%
            <BiUpArrowAlt />
          </div>
        </div>
      </div>

      <div className={style['card-container']}>
        <p className={style.content}>Ongoing project</p>

        <div className={style['total-container']}>
          <p className={style.number}>
            {
              project.data?.filter((p) => p.projectState?.state === 'active')
                .length
            }
          </p>

          <div className={`${style.decrease} ${style['icon-container']}`}>
            <TbChartHistogram />
            1.2%
            <BiDownArrowAlt />
          </div>
        </div>
      </div>

      <div className={style['card-container']}>
        <p className={style.content}>Completed project</p>

        <div className={style['total-container']}>
          <p className={style.number}>
            {
              project.data?.filter((p) => p.projectState?.name === 'Done')
                .length
            }
          </p>

          <div className={`${style.increase} ${style['icon-container']}`}>
            <TbChartHistogram />
            1.2%
            <BiUpArrowAlt />
          </div>
        </div>
      </div>

      <div className={style['card-container']}>
        <p className={style.content}>Canceled project</p>

        <div className={style['total-container']}>
          <p className={style.number}>{totalDeletedProject}</p>

          <div className={`${style.decrease} ${style['icon-container']}`}>
            <TbChartHistogram />
            1.2%
            <BiDownArrowAlt />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
